import { ClipLoader } from 'react-spinners'

interface WaitingForDataToProcessProps {
    waitMessage?: string
}

export const WaitingForDataToProcess = ({
    waitMessage = 'Fetching Data'
}: WaitingForDataToProcessProps) => {
    return (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <ClipLoader />
            {waitMessage}
        </div>
    )
}
