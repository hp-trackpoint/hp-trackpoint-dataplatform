import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  Space,
  message,
  Switch,
} from 'antd';
import { useEffect, useState } from 'react';
import http from '../utils/http';
import { PageTrackPoint } from './PageTrackPointManagePage';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import debounce from '../utils/debounce';
interface ModuleTrackPointData {
  page: number;
  pageSize: number;
  total: number;
  items: ModuleTrackPoint[];
}

interface ModuleTrackPoint {
  id: number;
  bid: string;
  name: string;
  description: string;
  status: boolean;
  createTime: string;
  updateTime: string;
  _count: {
    trackPoints: number;
  };
  page: PageTrackPoint;
}

const PageModuleManagePage = () => {
  const [modules, setModules] = useState<ModuleTrackPointData | any>({
    page: 1,
    pageSize: 10,
    total: 0,
    items: [],
  });
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchModules();
  }, []);

  // 获取模块列表
  const fetchModules = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      const Data = await http.get<ModuleTrackPointData>(
        `/track-manage/module?page=${page}&pageSize=${pageSize}`
      );
      // 转换时间格式
      const formattedItems = Data.items.map((item: ModuleTrackPoint) => ({
        ...item,
        createTime: dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss'),
        updateTime: dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss'),
      }));

      setModules({
        ...Data,
        items: formattedItems,
      });
    } catch (error) {
      message.error('获取模块列表失败');
    } finally {
      setLoading(false);
    }
  };
  const TimeSorter = (a: ModuleTrackPoint, b: ModuleTrackPoint) => {
    return dayjs(a.updateTime).valueOf() - dayjs(b.updateTime).valueOf();
  };
  const columns: ColumnsType<ModuleTrackPoint> = [
    {
      title: '模块名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '模块标识',
      dataIndex: 'bid',
      key: 'bid',
    },
    {
      title: '所属页面',
      dataIndex: ['page', 'cid'],
      key: 'pageCid',
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
      render: (status: boolean) => <span>{status ? '启用' : '禁用'}</span>,
    },
    {
      title: '事件类型',
      dataIndex: 'event',
      key: 'trackPoints',
    },
    {
      title: 'MV/MC',
      dataIndex: ['_count', 'records'],
      key: 'trackPoints',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sorter: TimeSorter, // 添加排序函数
      sortDirections: ['ascend', 'descend'], // 支持升序和降序排序
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      sorter: TimeSorter, // 添加排序函数
      sortDirections: ['ascend', 'descend'], // 支持升序和降序排序
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ModuleTrackPoint) => (
        <Space>
          <Button type="link" onClick={() => debouncedHandleEdit(record)}>
            编辑
          </Button>
          <Button
            type="link"
            danger
            onClick={() => debouncedHandleDelete(record.bid)}
          >
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
        await http.patch(`/track-manage/module/${editingId}`, values);
        message.success('更新成功');
      } else {
        await http.post('/track-manage/module/', values);
        message.success('创建成功');
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingId(null);
      fetchModules();
    } catch (error) {
      message.error('操作失败');
    }
  };
  type EditHandler = (record: ModuleTrackPoint) => void;

  type DeleteHandler = (cid: string) => Promise<void>;
  // 处理编辑
  const handleEdit: EditHandler = (record: ModuleTrackPoint) => {
    setEditingId(record.bid);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // 处理删除
  const handleDelete: DeleteHandler = async (bid: string) => {
    try {
      await http.delete(`/track-manage/module/${bid}`);
      message.success('删除成功');
      fetchModules();
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 添加防抖的处理编辑函数
  const debouncedHandleEdit = debounce(handleEdit, 500);
  // 添加防抖的处理删除函数
  const debouncedHandleDelete = debounce(handleDelete, 500);

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
          新增模块
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={modules.items}
        rowKey="id"
        loading={loading}
        pagination={{
          current: modules.page,
          pageSize: modules.pageSize,
          total: modules.total,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            fetchModules(page, pageSize);
          },
          onShowSizeChange: (_, size) => {
            fetchModules(1, size);
          },
        }}
      />

      <Modal
        title={editingId ? '编辑模块' : '新增模块'}
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
            label="模块名称"
            rules={[{ required: true, message: '请输入模块名称' }]}
          >
            <Input placeholder="请输入模块名称" />
          </Form.Item>
          <Form.Item
            name="bid"
            label="bid"
            rules={[{ required: true, message: '请输入模块标识' }]}
          >
            <Input placeholder="请输入模块标识" />
          </Form.Item>
          <Form.Item
            name="pageCid"
            label="cid"
            rules={[{ required: true, message: '请输入所属模块' }]}
          >
            <Input placeholder="请输入所属模块" />
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

export default PageModuleManagePage;
