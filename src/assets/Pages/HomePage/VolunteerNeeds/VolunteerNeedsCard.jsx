import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { Link } from 'react-router-dom';

export default function VolunteerNeedsCard({ volunteer }) {
  const { _id, thumbnail, post_title, category, deadline, description } = volunteer;

  return (
    <Card sx={{ maxWidth: 400, m: 2 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="180"
          image={thumbnail} // avatar hoặc ảnh
          alt={post_title}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {post_title}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'green' }}>
            {category}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, height: 60, overflow: 'hidden' }}>
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to={`/post-details/${_id}`} style={{ textDecoration: 'none' }}>
          <Button size="small" variant="contained" color="success">
            View Details
          </Button>
        </Link>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Deadline: {deadline}
        </Typography>
      </CardActions>
    </Card>
  );
}
