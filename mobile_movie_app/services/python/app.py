from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

API_KEY = "DEIN_API_KEY_HIER"  # TMDB v4 Bearer Token
BASE_URL = "https://api.themoviedb.org/3"

@app.route("/recommend", methods=["POST"])
def recommend_movies():
    data = request.json
    query = data.get("query", "")

    url = f"{BASE_URL}/search/movie"
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json;charset=utf-8",
    }
    params = {
        "query": query,
        "language": "de-DE",
    }

    response = requests.get(url, headers=headers, params=params)
    results = response.json().get("results", [])
    movies = [{"title": r["title"], "id": r["id"]} for r in results[:10]]

    return jsonify(movies)

if __name__ == "__main__":
    app.run(debug=True)
