import { Card } from 'antd';

interface CodeReviewProps {
  // 可以根据需要添加props
}

const CodeReview: React.FC<CodeReviewProps> = () => {
  return (
    <Card className="review-card">
      <h4>代码评审列表</h4>
      <div className="review-placeholder">
        <p>代码评审功能正在开发中...</p>
      </div>
    </Card>
  );
};

export default CodeReview;