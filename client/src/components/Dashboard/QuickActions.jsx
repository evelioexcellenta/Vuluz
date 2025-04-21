// import PropTypes from 'prop-types';
// import { Link } from 'react-router-dom';
// import { ROUTES } from '../../constants/routes';

// const QuickActions = ({ className = '' }) => {
//   // Quick action items
//   const actions = [
//     {
//       title: 'Transfer',
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
//         </svg>
//       ),
//       to: ROUTES.TRANSFER,
//       color: 'bg-primary-500 hover:bg-primary-600',
//       textColor: 'text-white'
//     },
//     {
//       title: 'Top Up',
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//         </svg>
//       ),
//       to: ROUTES.TOP_UP,
//       color: 'bg-accent-500 hover:bg-accent-600',
//       textColor: 'text-white'
//     },
//     {
//       title: 'History',
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//         </svg>
//       ),
//       to: ROUTES.TRANSACTIONS,
//       color: 'bg-secondary-500 hover:bg-secondary-600',
//       textColor: 'text-white'
//     },
//     {
//       title: 'Scan QR',
//       icon: (
//         <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
//         </svg>
//       ),
//       to: '#',
//       color: 'bg-gray-600 hover:bg-gray-700',
//       textColor: 'text-white'
//     }
//   ];
  
//   return (
//     <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
//       {actions.map((action, index) => (
//         <Link 
//           key={index}
//           to={action.to}
//           className={`
//             rounded-xl p-4 flex flex-col items-center justify-center
//             transition-all transform hover:scale-105 shadow-sm
//             ${action.color} ${action.textColor}
//           `}
//         >
//           <div className="p-3 rounded-full bg-white/20 mb-3">
//             {action.icon}
//           </div>
//           <span className="font-medium">{action.title}</span>
//         </Link>
//       ))}
//     </div>
//   );
// };

// QuickActions.propTypes = {
//   className: PropTypes.string
// };

// export default QuickActions;