import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'react-bootstrap';
const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    // Fetch the list of categories when the component mounts
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    // Make a GET request to fetch the list of categories
    axios.get('http://localhost:8081/categories')
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  };

  const handleAddCategory = () => {
    // Make a POST request to add a new category
    axios.post('http://localhost:8081/categories/add', { name: newCategoryName })
      .then((response) => {
        setCategories([...categories, response.data]);
        setNewCategoryName('');
      })
      .catch((error) => {
        console.error('Error adding category:', error);
      });
  };

  const handleDeleteCategory = (categoryId) => {
    // Make a DELETE request to delete a category
    axios.delete(`http://localhost:8081/categories/delete/${categoryId}`)
      .then(() => {
        setCategories(categories.filter((category) => category.id !== categoryId));
      })
      .catch((error) => {
        console.error('Error deleting category:', error);
      });
  };

  return (
    <div  style={{margin: "3%"}}>
      <h2 style={{ marginBottom: "1%", color: "#0969A2" }}>Категории</h2>
      <ul style={{margin: "3%",color: "#0969A2", fontWeight: "600", fontSize: "20px"}}>
        {categories.map((category) => (
          <li key={category.id}>
            {category.name}
            <Button variant='danger' style={{margin: "1%"}} onClick={() => handleDeleteCategory(category.id)}>Удалить</Button>
          </li>
        ))}
      </ul>
      <div style={{margin: "1%"}}>
        <input
          type="text"
          style={{marginRight: '1%'}}
          placeholder="Новая категория"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
        />
        <Button onClick={handleAddCategory} >Добавить категорию</Button>
      </div>
    </div>
  );
};

export default AdminCategories;
