import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import EccUtilsDesignCollectionType from '@elixir-cloud/design/dist/components/collection/collection';

const EccUtilsDesignCollection = dynamic(
  () => import('@elixir-cloud/design/dist/react/collection/index'),
  {
    ssr: false,
  },
);

export default function collection() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');

  const fetchDummyData = async (page, limit, searchString, tags) => {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/todos?_page=${page}&_limit=${limit}${searchString ? `&title_like=${searchString}` : ''
      }${tags ? `&completed=${tags === 'SUCCESS'}` : ''}`,
    );
    const data = await res.json();
    return data.map((item, index) => ({
      index: index + 1,
      name: item.title,
      key: `item-${item.id}`,
      lazy: true,
      tag: {
        name: item.completed ? 'SUCCESS' : 'ERROR',
        type: item.completed ? 'success' : 'danger',
      },
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const dataInitial = await fetchDummyData(1, 5, '', '');
      setItems(dataInitial);
    };

    fetchData();
  }, []);

  const handleExpand = async (e) => {
    // Check if child already exists
    const children = e.target.querySelectorAll(`[slot="${e.detail.key}"]`);
    if (children.length === 0) {
      // Add child to ecc-utils-design-collection
      const res = await fetch(
        `https://jsonplaceholder.typicode.com/todos/${e.detail.key.split('-')[1]}`,
      );
      const data = await res.json();
      const child = document.createElement('div');
      child.setAttribute('slot', e.detail.key);
      child.innerHTML = `<p>Title: ${data.title}</p>`;
      e.target.appendChild(child);
    }
  };

  const handleFilter = async (e) => {
    if (e.detail.key === 'title') {
      setSearch(e.detail.value);
      const data = await fetchDummyData(1, 5, e.detail.value.toLowerCase(), tag);
      const newItems = data.map((item, index) => ({
        index: index + 1,
        name: item.title,
        key: `item-${item.id}`,
        lazy: true,
        tag: {
          name: item.completed ? 'SUCCESS' : 'ERROR',
          type: item.completed ? 'success' : 'danger',
        },
      }));
      e.target.items = newItems;
      if (data.length < 5) {
        e.target.totalItems = data.length;
      }
    } else if (e.detail.key === 'tag') {
      setTag(e.detail.value);
      const data = await fetchDummyData(1, 5, search, e.detail.value);
      const newItems = data.map((item, index) => ({
        index: index + 1,
        name: item.title,
        key: `item-${item.id}`,
        lazy: true,
        tag: {
          name: item.completed ? 'SUCCESS' : 'ERROR',
          type: item.completed ? 'success' : 'danger',
        },
      }));
      e.target.items = newItems;
      if (data.length < 5) {
        e.target.totalItems = data.length;
      }
    }
  };

  const handlePageChange = async (e) => {
    if (e.detail.page === 3) {
      setTimeout(() => {
        document
          .querySelector<EccUtilsDesignCollectionType>('ecc-utils-design-collection')
          .error('This is an error message of page 3!');
      }, 1000);
      return;
    }
    const data = await fetchDummyData(e.detail.page, 5, search, tag);
    for (let i = 0; i < data.length; i += 1) {
      const element = data[i];
      const existingItem = e.target.items.find((item) => item.key === `item-${element.id}`);
      if (existingItem) {
        e.target.items = e.target.items.filter((item) => item.key !== `item-${element.id}`);
      }
      e.target.items = [
        ...e.target.items,
        {
          index: (e.detail.page - 1) * 5 + i + 1,
          name: element.title,
          key: `item-${element.id}`,
          lazy: true,
          tag: {
            name: element.completed ? 'SUCCESS' : 'ERROR',
            type: element.completed ? 'success' : 'danger',
          },
        },
      ];
    }
    setItems(e.target.items);
    if (data.length < 5) {
      e.target.totalItems = (e.detail.page - 1) * 5 + data.length;
    }
  };

  return (
    <div>
      <EccUtilsDesignCollection
        items={items}
        filters={[
          {
            key: 'title',
            type: 'search',
            placeholder: 'Search',
          },
          {
            key: 'tag',
            type: 'select',
            options: ['SUCCESS', 'WARNING', 'ERROR', 'DEFAULT', 'PRIMARY'],
            placeholder: 'Filter by tag',
            selectConfig: {
              // multiple: true,
            },
          },
        ]}
        onEccUtilsExpand={(e) => handleExpand(e)}
        onEccUtilsFilter={(e) => handleFilter(e)}
        onEccUtilsPageChange={handlePageChange}
      >
        <div slot='item-5'>Child item-5 without lazy loading</div>
      </EccUtilsDesignCollection>
    </div>
  );
}
