// // src/components/TemperatureDisplay.jsx
// import React, { Component } from 'react';
//
// class TemperatureDisplay extends Component {
//     render() {
//         const { readings = [] } = this.props;
//         return (
//             <div className="outer-box-temp-act">
//                 {readings.length === 0 ? (
//                     <div className="no-readings">No readings</div>
//                 ) : (
//                     readings.map((reading, index) => (
//                         <div
//                             key={index}
//                             className="inner-box-temp-act"
//                         >
//                             {reading.toString()}
//                         </div>
//                     ))
//                 )}
//             </div>
//         );
//     }
// }
//
// export default TemperatureDisplay;
