import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

import type { PriorityItem } from "../interfaces/common";
import { DraggableItem, Droppable } from "./DragAndDrop";
import { useDroppable } from "@dnd-kit/core";

export const ItemList = (prop: {priorityItems: PriorityItem[]}) => {
    return (
        <>
            {Array.from(prop.priorityItems).map((item: PriorityItem, index: number)=>(
            <Grid key={index} >
              <ItemCard item={item} position={index}/>
            </Grid>
          )
          )}
        </>
    )
}

export const ItemCard = (prop: {item: PriorityItem, position: number}) => {
    const {item, position} = prop;
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
      <DraggableItem position={position}>
      <Grid container direction={'column'}>
        <Grid>
          <Droppable id={`${position}-prev`}>
            <div ref={setPrevRef} style={style}>
              Drag before {position}
            </div>
          </Droppable>
        </Grid>
        <Grid>
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
        <Grid>
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


