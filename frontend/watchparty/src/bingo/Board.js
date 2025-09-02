import "./board.css"
import "../global/basic.css"
import { useCallback, useEffect, useState, useMemo } from "react"

export default function Board({className, size, hoverable, onClickCell, values, crossedValues}) {
    const [bingos, setBingos] = useState({})

    const checkForBingo = useCallback((arrayToCheckIn, targetName, result) => {
        const tickedInCol = arrayToCheckIn
            .map(key => crossedValues[key])   
            .filter(x => x).length
        if (tickedInCol === size) {
            result[targetName] = arrayToCheckIn
        }    
    }, [crossedValues, size])

    useEffect(() => {
        if(!crossedValues || size === 0) return
        const result = {}

        for (let idx = 0; idx < size; idx++) {
            const horizontalBingoInRowIdx = Array.from({length: size}, (_,i) => `${idx}-${i}`)
            checkForBingo(horizontalBingoInRowIdx, `row-${idx}`, result)

            const verticalBingoInColIdx = Array.from({length: size}, (_,i) => `${i}-${idx}`)
            checkForBingo(verticalBingoInColIdx, `col-${idx}`, result)
        }

        const diagonalDownBingo = Array.from({length: size}, (_,i) => `${i}-${i}`)
        checkForBingo(diagonalDownBingo, 'dig-down', result)

        const diagonalUpBingo = Array.from({length: size}, (_, i) => `${size-1-i}-${i}`)
        checkForBingo(diagonalUpBingo, 'dig-up', result)

        setBingos(result)
    }, [crossedValues, checkForBingo, size])

    const cellStatus = useCallback((rowIdx, colIdx) => {
        if(!crossedValues) return false
        return crossedValues[rowIdx + "-" + colIdx]
    }, [crossedValues])

    const cellClassNamesByStatus = useCallback((rowIdx, colIdx) => {
        const status = cellStatus(rowIdx, colIdx);
        return `${status ? 'ticked' : ''} board-cell ${hoverable ? 'hoverable' : ''}`;
    }, [cellStatus, hoverable])

    // assign colors dynamically
    const bingoColors = useMemo(() => {
        return Object.keys(bingos).reduce((acc, key, idx) => {
            const hue = (idx * 60) % 360;
            acc[key] = `hsla(${hue}, 70%, 60%, 0.4)`; 
            return acc;
        }, {});
    }, [bingos]);

    // compute background layers for a cell
    const cellStyle = useCallback((rowIdx, colIdx) => {
        const cellId = `${rowIdx}-${colIdx}`;
        const colors = Object.entries(bingos)
            .filter(([_, cells]) => cells.includes(cellId))
            .map(([key]) => bingoColors[key]);
        if (colors.length === 0) return {};
        return {
            backgroundImage: colors.map(c => `linear-gradient(${c}, ${c})`).join(", "),
        };
    }, [bingos, bingoColors]);

    return (
        <>
            <table className={"board "+className}><tbody>
                {Array.from({length: size}, (_,i) => i).map(rowIdx => 
                    <tr key={`row-${rowIdx}`}>
                        {Array.from({length: size}, (_,i) => i).map(colIdx => 
                            <td className={cellClassNamesByStatus(rowIdx, colIdx)}
                                key={`cell-${rowIdx}-${colIdx}`} 
                                style={cellStyle(rowIdx, colIdx)}
                                onClick={() =>  onClickCell ? onClickCell(rowIdx, colIdx, values[rowIdx+"-"+colIdx]) : ()=>{} }>
                                    {values[rowIdx+"-"+colIdx] ?? `${rowIdx}-${colIdx}`}
                            </td>
                        )}
                    </tr>
                )}
            </tbody></table>

            <div className="vertical-container top-margin">
                {Object.keys(bingos).map(x => 
                    <span key={x} style={{ 
                        backgroundColor: bingoColors[x],
                        width: 'fit-content'
                    }}>
                        Bingo: {x}
                    </span>)}
            </div>
        </>
    )
}
