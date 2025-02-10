import { Button, Table, Modal, Form, Input, Space, message, Switch } from 'antd';
import { useEffect, useState } from 'react';
import http from '../utils/http';
interface PageTrackPointData {
  page: number;
  pageSize: number;
  total: number;
  items: PageTrackPoint[];
}

export interface PageTrackPoint {
  id: number;
  cid: string;
  name: string;
  path: string;
  description: string;
  status: boolean;
  createTime: string;
  updateTime: string;
  _count: {
    records: number;
  };
}

const PageTrackPointManagePage = () => {
  const [trackPoints, setTrackPoints] = useState<PageTrackPointData | any>({
    page: 1,
    pageSize: 10,
    total: 0,
    items: []
  });
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTrackPoints();
  }, []);

  // 获取埋点列表
  const fetchTrackPoints = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const data = await http.get<PageTrackPointData>(`/track-manage/page?page=${page}&pageSize=${pageSize}`);
      // 由于 http.ts 中已经处理了响应数据的解构，这里直接使用返回的 data
      setTrackPoints(data);
    } catch (error) {
      message.error('获取埋点列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 修改表格列定义
  const columns = [
    {
      title: '埋点名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '埋点标识',
      dataIndex: 'cid',
      key: 'cid',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <span>{status ? '启用' : '禁用'}</span>
      ),
    },
    {
      title: 'PV',
      dataIndex: ['_count', 'records'],
      key: 'records',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PageTrackPoint) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.cid)}>
            删除
          </Button>
        </Space>
      ),
    },
  ];

  // 处理新增/编辑
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingId) {
        await http.patch(`/track-manage/page/${editingId}`, values);
        message.success('更新成功');
      } else {
        await http.post('/track-manage/page/', values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchTrackPoints();
    } catch (error) {
      message.error('操作失败');
    }
  };

  // 处理编辑
  const handleEdit = (record: PageTrackPoint) => {
    setEditingId(record.cid);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete = async (cid: string) => {
    try {
      await http.delete(`/track-manage/page/${cid}`);
      message.success('删除成功');
      fetchTrackPoints();
    } catch (error) {
      message.error('删除失败');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-4">
        <Button
          type="primary"
          onClick={() => {
            setIsModalVisible(true);
            setEditingId(null);
            form.resetFields();
          }}
        >
          新增埋点
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={trackPoints.items} 
        rowKey="id"
        loading={loading}
        pagination={{
          current: trackPoints.page,
          pageSize: trackPoints.pageSize,
          total: trackPoints.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            fetchTrackPoints(page, pageSize);
          },
          onShowSizeChange: (_, size) => {
            fetchTrackPoints(1, size);
          },
        }}
      />

      <Modal
        title={editingId ? '编辑埋点' : '新增埋点'}
        open={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
          setEditingId(null);
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="埋点名称"
            rules={[{ required: true, message: '请输入埋点名称' }]}
          >
            <Input placeholder="请输入埋点名称" />
          </Form.Item>
          <Form.Item
            name="cid"
            label="埋点标识"
            rules={[{ required: true, message: '请输入埋点标识' }]}
          >
            <Input placeholder="请输入埋点标识" />
          </Form.Item>
          <Form.Item
            name="path"
            label="路径"
            rules={[{ required: true, message: '请输入路径' }]}
          >
            <Input placeholder="请输入路径" />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea placeholder="请输入描述" />
          </Form.Item>
          <Form.Item name="status" label="状态" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PageTrackPointManagePage;
