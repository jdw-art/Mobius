import { Card } from 'antd';

interface TestCaseReviewProps {
  // 可以根据需要添加props
}

const TestCaseReview: React.FC<TestCaseReviewProps> = () => {
  return (
    <Card className="review-card">
      <h4>用例评审列表</h4>
      <div className="review-placeholder">
        <p>用例评审功能正在开发中...</p>
      </div>
    </Card>
  );
};

export default TestCaseReview;