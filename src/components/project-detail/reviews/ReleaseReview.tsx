import { Card } from 'antd';

interface ReleaseReviewProps {
  // 可以根据需要添加props
}

const ReleaseReview: React.FC<ReleaseReviewProps> = () => {
  return (
    <Card className="review-card">
      <h4>发布评审列表</h4>
      <div className="review-placeholder">
        <p>发布评审功能正在开发中...</p>
      </div>
    </Card>
  );
};

export default ReleaseReview;