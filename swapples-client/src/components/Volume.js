
export default function Volume({ setVolume, volume }) {
    return (
        <>
            <div>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(e.target.value)}
                />
            </div>
        </>
    )

}