'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import {firestore } from '@/firebase';
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { collection, deleteDoc, query, setDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { Istok_Web } from "next/font/google";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteItemName, setDeleteItemName] = useState('');
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('');


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
    setFilteredInventory(inventoryList);
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

  const deleteItemEntirely = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
      await updateInventory();
    }
    else {
      alert("Item not found in inventory.");
    }
  }


  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredInventory(inventory); // Show all items if search query is empty
    } else {
      setFilteredInventory(
        inventory.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      );
    }
  };

  useEffect(()=> {
    updateInventory()
  }, [])

  const handleOpenAdd = () => setOpenAdd(true)
  const handleCloseAdd = () => setOpenAdd(false)
  const handleOpenDelete = () => setOpenDelete(true)
  const handleCloseDelete = () => setOpenDelete(false)


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
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search items..."
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        sx={{ maxWidth: '800px', marginBottom: 2 }}
      />
      <Modal open={openAdd} onClose={handleCloseAdd}>
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
                handleCloseAdd()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius="8px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: "translate(-50%,-50%)",
          }}
        >
          <Typography variant="h6" color="#333">Delete Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={deleteItemName}
              onChange={(e) => {
                setDeleteItemName(e.target.value)
              }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                deleteItemEntirely(deleteItemName);
                setDeleteItemName('');
                handleCloseDelete();
              }}
            >
              Delete
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack direction="row" spacing={3}>
      <Button
        variant="contained"
        onClick={() => {
          handleOpenAdd()
        }}
        sx={{fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px' }}
      >
        Add New Item
      </Button>
      <Button
          variant="contained"
          color="error"
          onClick={handleOpenDelete}
          sx={{ fontWeight: 'bold', padding: '8px 16px', borderRadius: '8px' }}
        >
          Delete Item
        </Button>
      </Stack>
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
          filteredInventory.map(({name, quantity}) => (
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
                Quantity: {quantity}
              </Typography>
              <Stack spacing={2} direction="row">
              <Button variant="contained" color="success" onClick={() => {
                addItem(name)
              }}
              sx={{ padding: '6px 12px', borderRadius: '8px' }}
              >
                Add
              </Button>
              <Button variant="contained" color="error" onClick={() => {
                removeItem(name)
              }}
              sx={{ padding: '6px 12px', borderRadius: '8px' }}
              >
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
