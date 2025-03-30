// // import React from 'react';

// // function MoveHistory({ moves }) {
// //   return (
// //     <div  className="bg-gray-800 p-4 rounded-lg">
// //       <h3 className="text-lg font-bold mb-2">Move History</h3>
// //       <div className="space-y-2">
// //         {moves.map((move, index) => (
// //           <div key={index} className="text-sm">
// //             {/* Display move number */}
// //             <span className="font-bold">{move.moveNumber}.</span>
            
// //             {/* Display white's move */}
// //             <span className="ml-2">{move.white}</span>
            
// //             {/* Display black's move if it exists */}
// //             {move.black && <span className="ml-2">{move.black}</span>}
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }

// // export default MoveHistory;


// import React ,{useEffect,useRef} from "react";
// function MoveHistory({ moves }) {
//   const historyRef = useRef(null);

//   useEffect(() => {
//     // Scroll to the bottom automatically when a new move is added
//     if (historyRef.current) {
//       historyRef.current.scrollTop = historyRef.current.scrollHeight;
//     }
//   }, [moves]); // Runs when `moves` array updates

//   return (
//     <div ref={historyRef}
//      className="bg-gray-800 p-4 rounded-lg w-64 h-80 overflow-y-auto">
//       <h3 className="text-lg font-bold mb-2 text-white">Move History</h3>
//       <div className="space-y-2 text-white">
//         {moves.map((move, index) => (
//           <div key={index} className="text-sm flex items-center">
//             {/* Corrected move numbering */}
//             <span className="font-bold">{index + 1}.</span> 

//             {/* Display white's move */}
//             <span className="ml-2">{move.white}</span>

//             {/* Display black's move if it exists */}
//             {move.black && <span className="ml-2">{move.black}</span>}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default MoveHistory;




import React, { useEffect, useRef } from "react";

// function MoveHistory({ moves }) {
//     const historyRef = useRef(null);

//   useEffect(() => {
//     if (historyRef.current) {
//       historyRef.current.scrollTop = historyRef.current.scrollHeight;
//     }
//   }, [moves]);
//   return (
//     <div className="move-history">
//       {moves.map((move, idx) => (
//         <div key={idx} className="move-pair">
//           <span className="move-number">{move.moveNumber}.</span>
//           <span className="white-move">{move.white}</span>
//           {move.black && (
//             <>
//               <span className="move-number">{move.moveNumber}...</span>
//               <span className="black-move">{move.black}</span>
//             </>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }
// export default MoveHistory
function MoveHistory({ moves }) {
  const historyRef = useRef(null);

  useEffect(() => {
    historyRef.current?.scrollTo(0, historyRef.current.scrollHeight);
  }, [moves]);

  return (
    <div ref={historyRef} className="move-history bg-gray-800 p-4 rounded-lg h-64 overflow-y-auto">
      <div className="grid grid-cols-12 gap-1">
        {moves.map((move) => (
          <React.Fragment key={move.moveNumber}>
            {/* Move number */}
            <div className="col-span-2 text-gray-400 text-right pr-2">
              {move.moveNumber}.
            </div>
            
            {/* White's move */}
            <div className="col-span-5 text-white">
              {move.white || '\u00A0'}
            </div >
            
            {/* Black's move */}
            <div className="col-span-5 text-gray-400">
              {move.black || (move.white ? '...' : '\u00A0')}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
export default MoveHistory;