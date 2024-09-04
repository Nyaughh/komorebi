import { Pacifico } from 'next/font/google'

const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
})

export default function Component() {
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className={`${pacifico.className} text-9xl font-bold drop-shadow-lg text-white`} style={{ textShadow: "3px 3px 0px #FF69B4" }}>
        Komorebi
      </h1>
    </div>
  )
}