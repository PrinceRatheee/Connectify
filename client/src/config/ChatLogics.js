
 export  const getSender = (userId,users) => {
    console.log("getsender",users[0]);
  return (
    users[0]._id === userId? users[1].fullName:users[0].fullName
  )
}
 export  const getSenderImg = (userId,users) => {
    console.log("getsender",users[0]);
  return (
    users[0]._id === userId? users[1].pic:users[0].pic
  )
}
export const  getSenderFull = (userId,users) => {
    console.log("getsenderfulll",userId);
  return (
    users[0]._id === userId? users[1]:users[0]
  )
}

