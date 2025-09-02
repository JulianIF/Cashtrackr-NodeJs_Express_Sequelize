"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/style.css"

export default function Progressbar({percentage}: {percentage: number})
{
    return(
        <div className="flex justify-center p-10">
            <CircularProgressbar
                styles={buildStyles(
                {
                    pathColor: percentage >= 100 ? '#DC2626' : '#F59E0B',
                    trailColor: '#E1E1E1',
                    textColor: percentage >= 100 ? '#DC2626' : '#F59E0B',
                    textSize: 8
                })}
                text={`${percentage}% Spent`}
                value={percentage}
            />
        </div>
    )
}