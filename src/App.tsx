import { useEffect, useState } from 'react'
import './App.css'
import {DndContext} from '@dnd-kit/core';
import Grid from '@mui/material/Grid';
import {useDroppable} from '@dnd-kit/core';
import {CSS} from '@dnd-kit/utilities';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import { Button, CardActions, CardContent, Input, TextField } from '@mui/material';


type PriorityItem = {
  // position: number;
  product: string;
  url: string;
  price: number;
  justification: string;
}

function Droppable(props) {
  const {id} = props;
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

import {useDraggable} from '@dnd-kit/core';
// import { Typography } from '@mui/material';
// import {CSS} from '@dnd-kit/utilities';

function DraggableItem(props) {
  const {position} = props;
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `${position}-position`,
    data: {position: position},
  });
  // const style = transform ? {
  //   transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  // } : undefined;
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

// const ManageForm = () => {
//   const [item, setItem] = useState('');
//   const [priority, setPriority] = useState('low');


//   return (
//     <form>
//       {/* field for Item */}
//       <label htmlFor="item">Item</label>
//       <input type="text" />
//       {/* field for link to item with label*/}
//       <label htmlFor="link">Link</label>
//       <input type="text" />
//       {/* field for Priority */}
//       <label htmlFor="priority">Priority</label>
//       <select>
//         <option value="low">Low</option>
//         <option value="medium">Medium</option>
//         <option value="high">High</option>
//       </select>
//       {/* field for notes to justify priority*/}
//       <label htmlFor="notes">Notes</label>
//       <textarea />
//       <button type="submit">Add</button>
//     </form>
//   );
// }

function App() {
  const [count, setCount] = useState(0)
  const [isDropped, setIsDropped] = useState(false);
  const [priorityItems, setPriorityItems] = useState<PriorityItem[]>([]);

  // Form holder
  const [product, setProduct] = useState('');
  const [url, setUrl] = useState('');
  const [price, setPrice] = useState('');
  const [justification, setJustification] = useState('');

  // const draggableMarkup = (
  //   <Draggable>New Item</Draggable>
  // );

  useEffect(() => {
    const savedItems = localStorage.getItem('priority-item-list');
    if (savedItems) {
      setPriorityItems(JSON.parse(savedItems));
    }
  }, []); // Empty dependency array = runs only once on mount  

  
  function handleDragEnd(event) {

    // console.log(event)
    console.log(event.active)
    console.log(event.over)
    console.log("Priority items")
    console.log(priorityItems)
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }

    if (!event.over || !event.active) {
      console.log("Nothign here")
      return;
    }

    if (!event.over.data || !event.active.data) {
      console.log("No data here")
      return;
    }

    const {position: dropPosition} = event.over.data.current;
    const {position: activePosition} = event.active.data.current;

    // Slice priorityItems from dropPosition to activePosition
    const movedItem = priorityItems[activePosition];
    const newPriorityItems = [...priorityItems];
    const safeDropPosition = (dropPosition >= newPriorityItems.length) ? dropPosition-1 : dropPosition;

    newPriorityItems.splice(activePosition, 1);

    console.log(`Dropping ${activePosition} to  ${dropPosition}-> ${safeDropPosition}`)

    newPriorityItems.splice(safeDropPosition, 0, movedItem);
    setPriorityItems(newPriorityItems);
    // Set in local storage
    localStorage.setItem('priority-item-list', JSON.stringify(newPriorityItems));

    // setPriorityItems([...priorityItems]);  
  }



  const handleButtonPress = (event, product, price, url, justification) => {

      const item: PriorityItem = {
        // position: priorityItems.length,
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
    setPrice('');
    setJustification('');

  }

  const ItemCard = (prop: {item: PriorityItem, position: number}) => {
    const {item, position} = prop;
    const {isOverPrev, setNodeRef: setPrevRef} = useDroppable({
      id: `${position}-prev`,
      data: {position: position},
    });
    const {isOverNext, setNodeRef: setNextRef} = useDroppable({
      id: `${position}-next`,
      data: {position: position + 1},
    });

    const style = {
      color: (isOverPrev || isOverNext) ? 'green' : undefined,
    };
    
    
    // return (
    //   <div ref={setNodeRef} style={style}>
    //     {props.children}
    //   </div>
    // );


    
    return (
      <DraggableItem position={position}>
      <Grid container direction={'column'}>
        <Grid item xs={12} md={12}>
          <Droppable id={`${position}-prev`}>
          <div ref={setPrevRef} style={style}>
            Drag before {position}
          </div>
          </Droppable>
        </Grid>
        <Grid item xs={1} md={1}>
          <Card >
            <CardContent>
              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid size={6}> 
                  <Typography variant="h4">
                    {item.product}
                  </Typography>
                  <Typography variant="caption">
                    {item.url}
                  </Typography>
                </Grid>
                <Grid size={6}>
                  <Typography variant="h3">
                    ${item.price}
                  </Typography>
                </Grid>
              </Grid>
              
              <Typography variant="body2">
                {item.justification}
              </Typography>
              
            </CardContent>
          </Card>    
        </Grid>
        <Grid item xs={1} md={1}>
          <Droppable id={`${position}-next`}>
          <div ref={setNextRef} style={style}>
            Drag after {position}
          </div>
          </Droppable>
        </Grid>
      </Grid>
      
      </DraggableItem>
    )
  }

  return (
      <>
      <DndContext onDragEnd={handleDragEnd}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={1}>
        <Grid className="" container spacing={2} columns = {1}>
          <Grid item xs={12} md={6} centered>
            <Typography variant="h2">Shopping Wish List</Typography>

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
                      // Check if value is a number
                      const value = e.target.value;
                      if (isNaN(Number(value))) {
                        return;
                      }
                      setPrice(value)
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
                <Button onClick={(e) => handleButtonPress(e, product, price, url, justification)} variant="contained">Add product</Button>
                <Button onClick={() => setPriorityItems([])} variant="contained">Clear list</Button>
              </CardActions>
            </Card>            

          </Grid>
          {Array.from(priorityItems).map((item,index)=>(
            <Grid key={index} size={{ xs: 2, sm: 4, md: 4 }}>
              <ItemCard item={item} position={index}/>
            </Grid>
          )
          )}
          <Grid>
            {/* <Droppable>
              {'Drop here'}
            </Droppable> */}
          </Grid>
          {/* <Grid item xs={12} md={6}>
          </Grid>
          <Grid item xs={12} md={6}>
            <h1>Priority List</h1>
              <Droppable>
                {isDropped ? draggableMarkup : 'Drop here'}
              </Droppable>
          </Grid> */}
        </Grid>
      </Grid>
        

        {/* <div className="flex flex-row bg-red-500">
          <div className="basis-1/3 bg-blue-500">
            <h1>Shopping List</h1>
            <ManageForm />
            {!isDropped ? draggableMarkup : null}
          </div>
          <div className="basis-2/3 bg-green-500">
            <h1>Priority List</h1>
              <Droppable>
                {isDropped ? draggableMarkup : 'Drop here'}
              </Droppable>
          </div>
        </div> */}
      </DndContext>
    </>
  )
}

export default App
