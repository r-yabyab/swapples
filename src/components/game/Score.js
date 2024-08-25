
export default function Score ({ fruitsMatched }) {
    
    return (
        <>
        
            <div className="mb-2 flex gap-3 text-3xl text-zinc-300 font-bold items-center align-middle ">
                <div className="text-zinc-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-square" viewBox="0 0 16 16">
                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                        <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1v-1c0-1-1-4-6-4s-6 3-6 4v1a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1z" />
                    </svg>
                </div>
                <div className="text-zinc-400">1x</div>
                <div>{fruitsMatched ? fruitsMatched : "0"}</div>
            </div>
        </>
    )
}