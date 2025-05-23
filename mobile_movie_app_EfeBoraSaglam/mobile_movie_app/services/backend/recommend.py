from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import requests
import os

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.environ.get("eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJiNmVlOWVkMWIzOTU2NzI3ZTk4N2FiYjVkMTYzNyIsIm5iZiI6MTc0MjQ1ODA0NC4wNTQwMDAxLCJzdWIiOiI2N2RiY2NiY2M2MGQ1MTc3YWRlOWZkZDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Co_FbU2yCYva9H7JzOf4LylnWpmMssbCS0QE63RN5DE") or "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMGJiNmVlOWVkMWIzOTU2NzI3ZTk4N2FiYjVkMTYzNyIsIm5iZiI6MTc0MjQ1ODA0NC4wNTQwMDAxLCJzdWIiOiI2N2RiY2NiY2M2MGQ1MTc3YWRlOWZkZDIiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.Co_FbU2yCYva9H7JzOf4LylnWpmMssbCS0QE63RN5DE"
TMDB_API_URL = "https://api.themoviedb.org/3"

def fetch_movies_from_tmdb(query):
    url = f"{TMDB_API_URL}/search/movie"
    headers = {
        "Authorization": f"Bearer {TMDB_API_KEY}",
        "accept": "application/json"
    }
    params = {"query": query, "include_adult": False, "language": "en-US", "page": 1}
    resp = requests.get(url, headers=headers, params=params)
    data = resp.json()
    return data.get("results", [])

def fetch_similar_movies_from_tmdb(movie_id):
    url = f"{TMDB_API_URL}/movie/{movie_id}/similar"
    headers = {
        "Authorization": f"Bearer {TMDB_API_KEY}",
        "accept": "application/json"
    }
    params = {"language": "en-US", "page": 1}
    resp = requests.get(url, headers=headers, params=params)
    data = resp.json()
    return data.get("results", [])

def recommend_by_ml_tmdb(input_title):
    # 1. Suche den Film bei TMDB
    movies = fetch_movies_from_tmdb(input_title)
    if not movies:
        return []

    # 2. Nimm den ersten Treffer als Referenz
    ref_movie = movies[0]
    ref_id = ref_movie["id"]

    # 3. Hole ähnliche Filme von TMDB (optional: du kannst auch alle populären Filme holen)
    similar_movies = fetch_similar_movies_from_tmdb(ref_id)
    if not similar_movies:
        return []

    # 4. Machine Learning: Ähnlichkeit auf Genre + Overview (optional)
    all_movies = [ref_movie] + similar_movies
    corpus = [
        (m.get("title", "") + " " + " ".join([str(g) for g in m.get("genre_ids", [])]) + " " + m.get("overview", ""))
        for m in all_movies
    ]
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)
    cosine_sim = cosine_similarity(tfidf_matrix[0], tfidf_matrix).flatten()
    similar_indices = cosine_sim.argsort()[::-1][1:]  # [1:] -> überspringt sich selbst

    recommended = [all_movies[i]["title"] for i in similar_indices if cosine_sim[i] > 0]
    return recommended

@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.get_json()
    movie_name = data.get("movie_name", "")
    recommended = recommend_by_ml_tmdb(movie_name)
    return jsonify({"recommended_movies": recommended})

if __name__ == '__main__':
    app.run(debug=True)
    
## venv\Scripts\activate
## python recommend.py