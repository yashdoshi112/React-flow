import React, { useState, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from '@xyflow/react';
import axios from 'axios';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import '@xyflow/react/dist/style.css';
 
const initialNodes = [
  { id: '1', position: { x: 0, y: 200 }, data: { label: 'Explore' } },
];
const initialEdges = [];
 
export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [categories, setCategories] = useState([])
  const [meals, setMeals] = useState([])
  const [openSidebar, setOpenSidebar] = useState(false)
  const [details, setDetails] = useState({})
 
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const handleClick = (e) => {
    console.log("eve",  e)
    if(e.target.innerText == 'Explore') {
      axios.get('https://www.themealdb.com/api/json/v1/1/categories.php')
      .then(response => {
        let temp = response?.data?.categories.slice(0, 5)?.map((item, index) => ({
          id: `c${index+1}`,
          position: { x: 200, y: (index+1)*50 },
          data: { label: item.strCategory },
        }))
        setCategories(response?.data?.categories.slice(0, 5)?.map(item => item.strCategory))
        let tempEdges = response?.data?.categories.slice(0, 5)?.map((item, index) => ({
          id: `e1-c${index+1}`,
          source: '1', 
          target: `c${index+1}`
        }))
        setNodes([...initialNodes, ...temp])
        setEdges([...initialEdges, ...tempEdges])
      })
      .catch(error => {
        console.error(error);
      }); 
    }
    if(categories.includes(e.target.innerText)) {
      let temp = {
        id: e.target.innerText,
        position: { x: 400, y: e.target.dataset.id[1]*50 },
        data: { label: 'View Meals' },
      }
      let tempEdge = {
        id: `e${e.target.dataset.id}-c-view`,
        source: e.target.dataset.id, 
        target: e.target.innerText
      }
      setNodes([...nodes, temp])
      setEdges([...edges, tempEdge])
    }
    if(e.target.innerText == 'View Meals') {
      axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${e.target.dataset.id}`)
      .then(response => {
        let temp = response?.data?.meals.slice(0, 5).map((item, index) => ({
          id: `m${index+1}`,
          position: { x: 600, y: (index+1)*50 },
          data: { label: item.strMeal },
        }))
        setMeals(response?.data?.meals.slice(0, 5).map(item => item.strMeal))
        let tempEdges = response?.data?.meals.slice(0, 5).map((item, index) => ({
          id: `e${e.target.dataset.id}-m${index+1}`,
          source: e.target.dataset.id, 
          target: `m${index+1}`
        }))
        setNodes([...nodes, ...temp])
        setEdges([...edges, ...tempEdges])
      })
      .catch(error => {
        console.error(error);
      }); 
    }
    if(meals.includes(e.target.innerText)) {
      let temp = [{
        id: e.target.innerText,
        position: { x: 800, y: e.target.dataset.id[1]*50 },
        data: { label: 'View Ingredients' },
      }, {
        id: e.target.innerText + 'tags',
        position: { x: 800, y: e.target.dataset.id[1]*50 + 100},
        data: { label: 'View Tags' },
      }, {
        id: e.target.innerText + 'details',
        position: { x: 800, y: e.target.dataset.id[1]*50 + 150 },
        data: { label: 'View Details' },
      }]
      let tempEdges = [{
        id: `e${e.target.dataset.id}-m-ingredients`,
        source: e.target.dataset.id, 
        target: e.target.innerText
      }, {
        id: `e${e.target.dataset.id}-m-tags`,
        source: e.target.dataset.id, 
        target: e.target.innerText + 'tags'
      }, {
        id: `e${e.target.dataset.id}-m-details`,
        source: e.target.dataset.id, 
        target: e.target.innerText + 'details'
      }]
      setNodes([...nodes, ...temp])
      setEdges([...edges, ...tempEdges])
    }
    if(e.target.innerText == 'View Ingredients') {
      axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.dataset.id}`)
      .then(response => {
        let temp = [{
          id: `i1`,
          position: { x: 1000, y: 50 },
          data: { label: response?.data?.meals[0]['strIngredient1'] },
        }, {
          id: `i2`,
          position: { x: 1000, y: 100 },
          data: { label: response?.data?.meals[0]['strIngredient2'] },
        }, {
          id: `i3`,
          position: { x: 1000, y: 150 },
          data: { label: response?.data?.meals[0]['strIngredient3'] },
        }, {
          id: `i4`,
          position: { x: 1000, y: 200 },
          data: { label: response?.data?.meals[0]['strIngredient4'] },
        }, {
          id: `i5`,
          position: { x: 1000, y: 250 },
          data: { label: response?.data?.meals[0]['strIngredient5'] },
        }]
        setMeals(temp.map(item => item.data.label))
        let tempEdges = [{
          id: `e${e.target.dataset.id}-i1`,
          source: e.target.dataset.id, 
          target: `i1`
        }, {
          id: `e${e.target.dataset.id}-i2`,
          source: e.target.dataset.id, 
          target: `i2`
        }, {
          id: `e${e.target.dataset.id}-i3`,
          source: e.target.dataset.id, 
          target: `i3`
        }, {
          id: `e${e.target.dataset.id}-i4`,
          source: e.target.dataset.id, 
          target: `i4`
        }, {
          id: `e${e.target.dataset.id}-i5`,
          source: e.target.dataset.id, 
          target: `i5`
        }]
        setNodes([...nodes, ...temp])
        setEdges([...edges, ...tempEdges])
      })
      .catch(error => {
        console.error(error);
      }); 
    }
    if(e.target.innerText == 'View Tags') {
      axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.dataset.id.replace('tags','')}`)
      .then(response => {
        let temp = [{
          id: `t1`,
          position: { x: 1000, y: 300 },
          data: { label: response?.data?.meals[0]['strTags']?.split(',')[0] },
        }, {
          id: `t2`,
          position: { x: 1000, y: 350 },
          data: { label: response?.data?.meals[0]['strTags']?.split(',')[1] },
        }, {
          id: `t3`,
          position: { x: 1000, y: 400 },
          data: { label: response?.data?.meals[0]['strTags']?.split(',')[2] },
        }, {
          id: `t4`,
          position: { x: 1000, y: 450 },
          data: { label: response?.data?.meals[0]['strTags']?.split(',')[3] },
        }, {
          id: `t5`,
          position: { x: 1000, y: 500 },
          data: { label: response?.data?.meals[0]['strTags']?.split(',')[4] },
        }]
        setMeals(temp.map(item => item.data.label))
        let tempEdges = [{
          id: `e${e.target.dataset.id}-t1`,
          source: e.target.dataset.id, 
          target: `t1`
        }, {
          id: `e${e.target.dataset.id}-t2`,
          source: e.target.dataset.id, 
          target: `t2`
        }, {
          id: `e${e.target.dataset.id}-t3`,
          source: e.target.dataset.id, 
          target: `t3`
        }, {
          id: `e${e.target.dataset.id}-t4`,
          source: e.target.dataset.id, 
          target: `t4`
        }, {
          id: `e${e.target.dataset.id}-t5`,
          source: e.target.dataset.id, 
          target: `t5`
        }]
        setNodes([...nodes, ...temp])
        setEdges([...edges, ...tempEdges])
      })
      .catch(error => {
        console.error(error);
      }); 
    }
    if(e.target.innerText == 'View Details') {
      axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${e.target.dataset.id.replace('details','')}`)
      .then(response => {
        setDetails(response?.data?.meals[0])
        setOpenSidebar(true)
      })
      .catch(error => {
        console.error(error);
      });
      setOpenSidebar(true)
    }
  }
 
  console.log(nodes)
  return (
    <div style={{width: '100vw', height: '100vh', display: 'flex'}}>
      <ReactFlow
      style={{ width: '70vw', height: '100vh'}}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onClick={(e) => handleClick(e)}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
      {openSidebar && <Card sx={{ width: '30vW', height: '100vH', float: 'right', overflowY:'scroll' }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="200"
            image={details.strMealThumb + '/preview'}
            alt="details"
          />
          <Stack direction="row" spacing={1}>
            <Chip label={details.strCategory} color="purple" />
            <Chip label={details.strArea} color="yellow" />
            <Chip label={details.strDrinkAlternate} color="red" />
          </Stack>
          <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px'}}>
            <span style={{color: 'grey', fontSize: '12px'}}>Category</span>
            <span style={{color: 'black', fontSize: '12px'}}>{details.strCategory}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px'}}>
          <span style={{color: 'grey', fontSize: '12px'}}>Area</span>
          <span style={{color: 'black', fontSize: '12px'}}>{details.strArea}</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', margin: '20px'}}>
          <span style={{color: 'grey', fontSize: '12px'}}>Youtube</span>
          <span style={{color: 'black', fontSize: '12px', width: '45%', wordWrap: 'break-word'}}>{details.strYoutube}</span>
          </div>
          <CardContent>
            <Typography gutterBottom variant="h7" component="div">
              Instructions
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {details.strInstructions}
            </Typography>
          </CardContent>
        </CardActionArea>
        </Card>}
    </div>
  );
}