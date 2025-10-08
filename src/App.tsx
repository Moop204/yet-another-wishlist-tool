/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type MouseEvent } from 'react'
import './App.css'
import {DndContext, type DragEndEvent} from '@dnd-kit/core';
import Grid from '@mui/material/Grid';

import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, TextField } from '@mui/material';

import type { PriorityItem } from './interfaces/common';
import { ItemList } from './components/ItemCard';




function App() {
  const [priorityItems, setPriorityItems] = useState<PriorityItem[]>([]);

  // Form holder
  const [product, setProduct] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState(0);
  const [justification, setJustification] = useState('');


  useEffect(() => {
    const savedItems = localStorage.getItem('priority-item-list');
    if (savedItems) {
      setPriorityItems(JSON.parse(savedItems));
    }
  }, []);  
  
  function handleDragEnd(event: DragEndEvent) {


    if (!event.over || !event.active) {
      console.log("Nothing here")
      return;
    }

    if (!event.over.data || !event.active.data) {
      console.log("No data here")
      return;
    }

    const {position: dropPosition} = event.over.data.current;
    const {position: activePosition} = event.active.data.current;

    const movedItem = priorityItems[activePosition];
    const newPriorityItems = [...priorityItems];
    const safeDropPosition = (dropPosition >= newPriorityItems.length) ? dropPosition-1 : dropPosition;

    newPriorityItems.splice(activePosition, 1);

    console.log(`Dropping ${activePosition} to  ${dropPosition}-> ${safeDropPosition}`)

    newPriorityItems.splice(safeDropPosition, 0, movedItem);
    setPriorityItems(newPriorityItems);
    localStorage.setItem('priority-item-list', JSON.stringify(newPriorityItems));
  }



  const handleButtonPress = (event: MouseEvent<HTMLButtonElement, MouseEvent<any>>, product: string, price: number, url: string, justification: string) => {
      const item: PriorityItem = {
        product: product,
        url: url,
        price: price,
        justification: justification,
    }
    const newPriorityItem = [...priorityItems, item] 
    setPriorityItems(newPriorityItem)
    localStorage.setItem('priority-item-list', JSON.stringify(newPriorityItem));

    // Clear form
    setProduct('');
    setUrl('');
    setPrice(0);
    setJustification('');
  }

  const handleRemove = (position: number) => {
    console.log(`removing ${position}`)
    const newPriorityItems = [...priorityItems];
    newPriorityItems.splice(position, 1);
    setPriorityItems(newPriorityItems);
    localStorage.setItem('priority-item-list', JSON.stringify(newPriorityItems));
  } 

  return (
      <>
        <DndContext onDragEnd={handleDragEnd}>
          <Grid className="" container spacing={2} direction={'column'}>
            <Grid >
              <Typography variant="h2">
                Shopping Wish List
              </Typography>

              <Card>
                <CardContent>
                  <TextField
                      required
                      id="product-field"
                      label="Product"
                      size="small"
                      onChange={(e) => setProduct(e.target.value)}
                      value={product}
                  />
                  <TextField
                      required
                      id="cost-field"
                      label="Cost"
                      size="small"
                      value={price}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (isNaN(Number(value))) {
                          return;
                        }
                        setPrice(Number(value))
                      }}
                  />
                  <TextField
                      required
                      id="link-field"
                      label="Link"
                      size="small"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                  />
                  <TextField
                      required
                      id="justification-field"
                      label="Justification"
                      size="small"
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                  />
                </CardContent>  
                <CardActions>
                  <Button onClick={(e) => handleButtonPress(e as any, product, price, url, justification)} variant="contained">Add product</Button>
                  <Button onClick={() => setPriorityItems([])} variant="contained">Clear list</Button>
                </CardActions>
              </Card>            

            </Grid>
              <ItemList priorityItems={priorityItems} onRemove={handleRemove}/>
            <Grid>
            </Grid>
          </Grid>
        </DndContext>
      
    </>
  )
}

export default App
