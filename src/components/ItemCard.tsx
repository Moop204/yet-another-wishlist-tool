import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import type { PriorityItem } from "../interfaces/common";
import { DraggableItem, Droppable } from "./DragAndDrop";
import { useDroppable } from "@dnd-kit/core";
import Button from "@mui/material/Button";
import { useState } from "react";

export const ItemList = (prop: {priorityItems: PriorityItem[], onRemove: (position: number) => void}) => {
    return (
        <>
            {Array.from(prop.priorityItems).map((item: PriorityItem, index: number)=>(
            <Grid key={index} >
              <ItemRecord item={item} position={index} onRemove={prop.onRemove}/>
            </Grid>
          )
          )}
        </>
    )
}

// Component purely for displaying information
const ItemCard = (prop: {item: PriorityItem}) => {
    const {item} = prop;
    return (
      <Card>
        <CardContent>
          <Grid container>
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
        </CardContent>
      </Card>
    )
}

const RemoveItemButton = (prop: {position: number, onRemove: (position: number) => void}) => {
    const {position, onRemove} = prop;
    return (
        <Button variant="contained" onClick={(e) => { 
          e.stopPropagation();
          console.log("Clicked")
          onRemove(position)
          }}>Remove</Button>
    )
}

const ItemRecord = (prop: {item: PriorityItem, position: number, onRemove: (position: number) => void}) => {
    const {item, position, onRemove} = prop;
    const [isHovered, setIsHovered] = useState(false);
    const {active: isOverPrev, setNodeRef: setPrevRef} = useDroppable({
      id: `${position}-prev`,
      data: {position: position},
    });
    const {active: isOverNext, setNodeRef: setNextRef} = useDroppable({
      id: `${position}-next`,
      data: {position: position + 1},
    });

    const style = {
      color: (isOverPrev || isOverNext) ? 'green' : undefined,
    };
    
    return (
      <Grid container direction={'column'}>
          <Grid>
            <Droppable id={`${position}-prev`}>
              <div ref={setPrevRef} style={style}>
                Drag before {position}
              </div>
            </Droppable>
          </Grid>
          <Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} >
                  <Grid size={11}>
                    <DraggableItem position={position}>
                      <ItemCard item={item}/>
                    </DraggableItem>
                  </Grid>
                  <Grid size={1}>
                    {isHovered && <RemoveItemButton position={position} onRemove={onRemove} />}
                  </Grid>
                </Grid>

                <Typography variant="body2">
                  {item.justification}
                </Typography>
                
          </Grid>
          <Grid>
            <Droppable id={`${position}-next`}>
              <div ref={setNextRef} style={style}>
                Drag after {position}
              </div>
            </Droppable>
          </Grid>
      </Grid>
      
    )
  }


