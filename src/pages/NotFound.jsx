import { Link } from 'react-router';

function NotFound() {
  return (
    <div>
      <p>Page not found.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  );
}

export default NotFound;
