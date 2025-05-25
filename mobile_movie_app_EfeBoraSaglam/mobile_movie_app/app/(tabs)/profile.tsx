import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'

export default function ProfileScreen() {
  const { user } = useUser()

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <SignedIn>
        <Text className="text-white text-xl font-semibold mb-4">
          Hello {user?.emailAddresses[0].emailAddress}
        </Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <TouchableOpacity
          className="bg-sky-600 rounded-md py-3 flex items-center justify-center mb-4 p-3"
        >
          <Link href="/(auth)/sign-in">
            <Text className="text-white">Sign in</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-accent rounded-md py-3 flex items-center justify-center p-3"
        >
          <Link href="/(auth)/sign-in">
            <Link href="/(auth)/sign-up">
              <Text className="text-white mt-2">Sign up</Text>
            </Link>
          </Link>
        </TouchableOpacity>


      </SignedOut>
    </View>
  )
}