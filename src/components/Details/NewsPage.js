import React from 'react';
import {
  Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button,
} from '@mui/material';

const newsArticles = [
  {
    id: 1, image: '/images/news1.jpg', category: '#Health', title: 'Air Quality Improves in Lusaka', summary: 'Recent rains have helped reduce PM2.5 levels...',
  },
  {
    id: 2, image: '/images/news2.jpg', category: '#Climate', title: 'New Policy on Emissions', summary: 'Government introduces stricter emission standards...',
  },
  // ...more
];

export default function NewsPage() {
  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>Latest Air Quality News</Typography>
      <Grid container spacing={2}>
        {newsArticles.map((article) => (
          <Grid item xs={12} sm={6} key={article.id || article.title}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia component="img" image={article.image} height="140" />
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">{article.category}</Typography>
                <Typography variant="h6" fontWeight="bold">{article.title}</Typography>
                <Typography variant="body2" color="text.secondary">{article.summary}</Typography>
              </CardContent>
              <CardActions sx={{ mt: 'auto' }}>
                <Button size="small">Read More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
