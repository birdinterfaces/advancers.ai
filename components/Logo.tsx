import Image from 'next/image'

export const Logo = () => {
  return (
    <Image
      src="/path/to/your/logo.png"
      alt="Logo"
      width={150}  // Replace with your actual logo width
      height={50}  // Replace with your actual logo height
      priority={true}
      quality={100}
    />
  )
} 