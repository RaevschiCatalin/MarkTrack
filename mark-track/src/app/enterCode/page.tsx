'use client'

export default function EnterCode() {
    return (
        <div className="flex justify-center items-center h-screen pb-10">
            <div className="mx-auto flex w-full max-w-sm flex-col gap-6">
                <div className="flex flex-col items-center">
                    <h1 className="text-3xl font-semibold">Enter Code</h1>
                    <p className="text-sm">Enter the code you received from your institution</p>
                </div>
                <div className="form-group">
                    <div className="form-field">
                        <input
                            placeholder="Code"
                            type="text"
                            className="input input-block"
                        />
                    </div>
                </div>
                <button className="btn btn-primary">Submit</button>
            </div>
        </div>
    )
}