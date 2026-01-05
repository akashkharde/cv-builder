import { Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg text-center">
        <Typography variant="h3" className="font-bold mb-2">
          404
        </Typography>

        <Typography variant="h6" className="mb-4">
          Page Not Found
        </Typography>

        <Typography variant="body2" color="text.secondary" className="mb-6">
          The page you are looking for doesn’t exist or has been moved.
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
