
export default function Lobby () {


    return (
        <>
        <div>
            <div>Welcome 2 the Lobby</div>

            <div className="mt-10">
                <div>Available lobbies:</div>
                <div className="flex flex-wrap [&>div]:w-[100px] [&>div]:h-[100px] [&>div]:bg-blue-400 gap-8">
                    <div className=" cursor-pointer">Enter</div>
                    <div>1</div>
                    <div>1</div>
                    <div>1</div>
                </div>
            </div>

        </div>
        </>
    )
}