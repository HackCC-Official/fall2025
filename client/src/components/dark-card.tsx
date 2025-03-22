export function DarkCard({ children } : { children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col bg-black bg-opacity-20 px-7 py-7 rounded-3xl w-[275px] sm:w-[350px] font-mont text-xl text-center">
      {children}
    </div>
  )
}