import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link } from 'expo-router'
import { Text, View } from 'react-native'
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
        <Link href="/(auth)/sign-in">
          <Text className="text-blue-500">Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text className="text-blue-500 mt-2">Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  )
}