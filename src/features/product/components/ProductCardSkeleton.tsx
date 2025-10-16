import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function ProductCardSkeleton() {
  return (
    <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Skeleton variant="rectangular" height={200} animation="wave" />
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="text" width="40%" height={28} />
        </Stack>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0, gap: 1 }}>
        <Button size="small" disabled>
          <Skeleton variant="text" width={80} />
        </Button>
        <Button size="small" disabled>
          <Skeleton variant="text" width={90} />
        </Button>
      </CardActions>
    </Card>
  );
}
