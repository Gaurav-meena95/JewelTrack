import React from 'react'

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <div className="w-12 h-12 border-4 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"></div>
            <p className="text-muted-foreground animate-pulse">Loading please wait....</p>
        </div>
    )
}

export default Loading