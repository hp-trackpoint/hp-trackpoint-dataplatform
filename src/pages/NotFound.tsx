import React from 'react';
import { Result, Card, Button } from 'antd';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div>
      <Card>
        <Result
          status="404"
          title="404"
          subTitle="对不起，您访问的页面不存在。"
          extra={
            <Button type="primary">
              <Link to={'/'}>返回首页</Link>
            </Button>
          }
        />
      </Card>
    </div>
  );
};
export default NotFoundPage;
