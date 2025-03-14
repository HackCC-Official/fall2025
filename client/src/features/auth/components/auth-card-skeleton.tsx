export function AuthCardSkeletonDefault() {
  return (
    <div className="space-y-4 animate-pulse">
        <div className="space-y-2">
            <div className="bg-gray-200 rounded-md h-10"></div>
        </div>
        <div className="space-y-2">
            <div className="bg-gray-200 rounded-md h-10"></div>
            <div className="flex justify-end">
                <div className="bg-gray-200 rounded w-28 h-4"></div>
            </div>
        </div>
        <div className="bg-gray-200 rounded-md h-10"></div>
    </div>
  )
}

export function AuthCardSkeletonExtra() {
  return (
    <div className="space-y-4 animate-pulse">
        <div className="space-y-2">
            <div className="bg-gray-200 rounded-md h-10"></div>
        </div>
        <div className="space-y-2">
            <div className="bg-gray-200 rounded-md h-10"></div>
        </div>
        <div className="space-y-2">
            <div className="bg-gray-200 rounded-md h-10"></div>
        </div>
        <div className="bg-gray-200 rounded-md h-10"></div>
    </div>
  )
}