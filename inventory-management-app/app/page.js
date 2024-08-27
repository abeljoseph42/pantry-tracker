'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, query, setDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { Istok_Web } from "next/font/google";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    console.log(inventoryList)
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      await setDoc(docRef, {quantity: quantity + 1})
      } else {
        await setDoc(docRef, {quantity: 1})
      }
      await updateInventory()
    }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()) {
      const {quantity} = docSnap.data()
      if(quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, {quantity: quantity - 1})
      }
    }

    await updateInventory()
  }

  useEffect(()=> {
    updateInventory()
  }, [])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)


  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      bgcolor="#f7f9fc"
      padding={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="8px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6" color="#333">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={() => {
          handleOpen()
        }}
        sx={{fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px' }}
      >
        Add New Item
      </Button>
      <Box 
        width="100%"
        maxWidth="800px"
        border="1px solid #ddd"
        borderRadius="8px"
        overflow="hidden"
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
        bgcolor="white">
        <Box 
        width="800px" 
        height="100px" 
        bgcolor="#ADD8E6" 
        display="flex"
        alignItems="center" 
        justifyContent="center">
          <Typography variant = 'h2' color = "#333" fontWeight="bold">
            Inventory Items
          </Typography>
        </Box>
      <Stack width="800px" height="300px" spacing={2} overflow="auto" padding={2}>
        {
          inventory.map(({name, quantity}) => (
            <Box 
            key={name} 
            width="100%" 
            minHeight="150px" 
            display="flex" 
            alignItems="center" 
            justifyContent="space-between" 
            bgColor="#f0f0f0"
            padding={5}>
              <Typography variant="h3" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack spacing={2} direction="row">
              <Button variant="contained" onClick={() => {
                addItem(name)
              }}>
                Add
              </Button>
              <Button variant="contained" onClick={() => {
                removeItem(name)
              }}>
                Remove
              </Button>
              </Stack>
            </Box>
          ))
        }
      </Stack>
      </Box>
    </Box>
  )
}
