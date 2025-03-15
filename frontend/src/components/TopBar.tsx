// import { Container } from 'react-bootstrap';

// const TopBar = () => {
//   return (
//     <div className="topbar-container" style={{ position: 'relative' }}>
//       <div className="hero-section" style={{ backgroundImage: 'url(/TopBarPhoto.jpg)', backgroundSize: 'cover', height: '45vh' }}>
//         <Container className="text-center" style={{ paddingTop: '15vh' }}>
//           <h1 className="text-white py-5">Discover New Places and Create Unforgettable Memories</h1>
//         </Container>
//       </div>
//     </div>
//   );
// };

// export default TopBar;
import { Container } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

const TopBar = () => {
  const location = useLocation();
  const isUploadPage = location.pathname === '/uploadPost';

  return (
    <div className="profile-hero" style={{ 
      position: 'relative',
      height: '200px',
      backgroundColor: 'var(--primary-color)',
      backgroundImage: 'linear-gradient(to right, #14b8a6, #06b6d4)',
      marginBottom: '2rem'
    }}>
      <Container className="h-100 d-flex align-items-center">
        <h1 className="text-white">
          {isUploadPage ? 'Create New Travel Story' : 'My Travel Journey'}
        </h1>
      </Container>
    </div>
  );
};

export default TopBar;