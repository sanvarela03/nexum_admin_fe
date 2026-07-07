import { useState } from 'react'
import { User } from '@heroui/react'
import { getColorFromString } from '@utils'

interface UserFirstNameProps {
  user: {
    firstName: string
    lastName: string
    email: string
    imgUrl?: string
  }
}

export default function UserFirstName({ user }: UserFirstNameProps) {
  const [imgFailed, setImgFailed] = useState(false)

  const fullName = `${user.firstName} ${user.lastName}`
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
  const fallbackColor = getColorFromString(fullName)

  const showFallback = !user.imgUrl || imgFailed

  return (
    <User
      name={fullName}
      description={user.email}
      avatarProps={{
        radius: 'lg',
        src: !showFallback ? user.imgUrl : undefined,
        name: initials,
        style: showFallback
          ? { backgroundColor: fallbackColor, color: 'white' }
          : undefined,
        imgProps: {
          onError: () => setImgFailed(true),
        },
      }}
    >
      {user.email}
    </User>
  )
}