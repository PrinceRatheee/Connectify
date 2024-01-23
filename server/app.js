const express = require('express');
const { connect } = require('./db/connection');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const app = express();
const cors = require('cors');
const dotenv=require("dotenv");
dotenv.config();
// Connect to the database
connect();

// Import models
const Users = require('./models/userModel');
const User = require('./models/userModel');
const Chat = require('./models/chatModel');
const Message=require('./models/messageModel');
// const Conversations=require('./models/Conversation');
// const Messages=require('./models/Messages');
// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const port = process.env.PORT || 8000;

// Routes
app.get('/', (req, res) => {
  res.send("This is Backend");
});

app.post('/api/register', async (req, res) => {
  try {
    console.log("Received registration request");
    const { user, pic } = req.body;
    const { fullName, email, password } = user;
    // console.log("pic received",pic,fullName,email,password);
    // console.log(req.body);
    console.log("pic received", pic);
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required details', status: 400 });
    } else {
      const isAlreadyExist = await Users.findOne({ email });

      if (isAlreadyExist) {
        return res.status(400).json({ message: 'User Alredy Exist', status: 400 });
      } else {
        const salt = await bcryptjs.genSalt(10);
        const hashedpassword = await bcryptjs.hash(password, salt);

        const newUser = new Users({
          fullName,
          email,
          password: hashedpassword,
          pic: pic
        });

        await newUser.save();
        console.log("mbvdhmsbdfndm");
        return res.status(200).json({ message: 'User Registered Successfully', status: 200 });
        ;
      }
    }
  } catch (error) {
    console.log(error, "signup backend error");
    return res.status(500).json({ message: 'Internal Server Error', status: 500 });;
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Please fill all the required details', status: 400 });
    } else {
      const user = await Users.findOne({ email });
      if (!user) {
        res.status(400).json({ message: 'User Email or Password is Incorrect', status: 400 });
      }
      else {


        const validateUser = await bcryptjs.compare(password, user.password);
        if (!validateUser) {
          res.status(400).json({ message: 'User Email or Password is Incorrect', status: 400 });
        }
        else {
          const payload = {
            userId: user._id,
            email: user.email
          }
          const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "chatapp";
          jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600 }, async (err, token) => {
            await Users.updateOne({ _id: user._id }, {
              $set: { token }
            })
            user.save();
            return res.status(200).json({ user: { id: user._id, email: user.email, fullName: user.fullName, imageUrl: user.pic }, token: token, message: "user signedin successfully", status: 200 });

          })
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
})

//for searching user route
app.post('/api/user', async (req, res) => {
  const { userId } = req.body;
  // console.log("fghajskysgdklasfh",userId);

  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ]
  } : {}
  const users = await User.find(keyword).find({ _id: { $ne: userId } });
  res.send(users);
  console.log(keyword);
})

// app.post('/api/conversation',async(req,res)=>{
//     try {
//         const {senderId,receiverId}=req.body;
//         const newConversation=new Conversations({members:{senderId,receiverId}});
//         await newConversation.save();
//         res.status(200).json({message:'Conversation Created Successfully'});

//     } catch (error) {
//         console.log(error,'E rror');
//     }
// })

// app.get('/api/conversation/:userId',async(req,res)=>{
//     try {
//         const userId=req.params.userId;
//         const conversations=await Conversations.find({members:{$in:{userId}}});
//         Conversations.map((conversation)=>{
//             console.log(conversation);
//         })
//         console.log("conversations",conversations);
//         const conversationUserData=conversations.map(async(conversation)=>{
//             const receiverId=conversation.members.find((member)=>member!=userId);
//             const user=await Users.findById(receiverId);
//             return {user:{email:user.email,fullName:user.fullName},conversationId:conversation._id}
//         })
//         res.status(200).json(await conversationUserData);


//     } catch (error) {
//         console.log(error);
//     }
// })

// app.post('/api/message',async(req,res)=>{
//     try {
//         const {conversationId,senderId,message,receiverId=''}=req.body;
//         if(!senderId || !message) return res.status(400).send('Please fill all required details');
//         if(!conversationId && receiverId){
//             const newConversation=new Conversations({members:[receiverId,senderId]});
//             await newConversation.save();
//             const newMessage=new Messages({conversationId:newConversation._id,senderId,message});
//             await newMessage.save();
//             return res.status(200).send('Message sent successfully');
//         }else if(!conversationId && !receiverId){
//             return res.status(400).send('Please fill all the required details');
//         }
//         const newMessage=new Messages({conversationId,senderId,message});
//         await newMessage.save();
//         res.status(200).send('Message sent successfully');
//     } catch (error) {
//         console.log(error);
//     }
// })

// app.get('/api/message/:conversationId',async(req,res)=>{
//     try {
//         const conversationId=req.params.conversationId;
//         if(conversationId==='new') return res.status(200).json([]);
//         const messages=await Messages.find({conversationId});
//         const messageUserData=Promise.all(messages.map(async(message)=>{
//             const user=await Users.findById(message.senderId);
//             return{user:{email:user.email,fullName:user.fullName},message:message.message}
//         }));
//         res.status(200).json(await messageUserData)
//     } catch (error) {
//         console.log(error);
//     }
// })

//to create or access chats
app.post("/", async (req, res) => {
  const { userId } = req.body;
})


app.get('/api/users', async (req, res) => {
  try {
    const users = await Users.find();
    const usersData = Promise.all(users.map(async (user) => {
      return { user: { email: user.email, fullName: user.fullName }, userId: user._id };
    }))
    res.status(200).json(await usersData);
  } catch (error) {
    console.log(error);
  }
})

//to create or access chat
app.post('/api/chat', async (req, res) => {
  const { userId, senderId } = req.body;
  console.log("vgwfjkdl;sfd",userId," ",senderId);

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: senderId } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [senderId, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
})

//to fetch all the chats/conversations for a particular user
app.post('/api/fetchchat', async (req, res) => {
  try {
    const { userId } = req.body;
    // console.log("5467fgjh",userId);
    Chat.find({ users: { $elemMatch: { $eq: userId } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      })
  } catch (error) {
    console.log(error);
    res.status(400);
    throw new Error(error.message);
  }
})

//for creating a group
app.post('/api/chat/group', async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);
  var user = JSON.parse(req.body.user);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }

});

//for renaming a group, app.put to update 
app.put('/api/chat/rename', async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
})

//to remove someone from the group or to leave the group
app.put('/api/chat/groupremove', async (req, res) => {
  const { chatId, userId } = req.body;
  //userId is the id which we want to add

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
})

//to add someone to the group
app.put('/api/chat/groupadd', async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
})

//to create and send a message
app.post('/api/message',async(req,res)=>{
  const {senderId,content,chatId}=req.body;

  if(!content || !chatId){
    console.log("Invalid data passed into request");
    return res.status(400);
  }

  var newMessage={
    sender:senderId,
    content:content,
    chat:chatId
  }

  try {
    var message=await Message.create(newMessage);
    message =await message.populate("sender","name pic");
    message =await message.populate("chat");
    message=await User.populate(message,{
      path:'chat.users',
      select:"name pic email"
    });

    await Chat.findByIdAndUpdate(req.body.chatId,{
      latestMessage:message,
    });

    res.json(message);

  } catch (error) {
    console.log(error);
  }
})

//to fetch all the messages for a chat
app.get('/api/message/:chatId',async(req,res)=>{
  try {
    const messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})


const server=app.listen(port, () => {
  console.log('Listening on port ' + port);
});
const io=require("socket.io")(server,{
  pingTimeout:60000,
  cors:{
    origin:"https://connectify-chat.vercel.app"
  }
})
io.on("connection",(socket)=>{
  console.log('connected to socket.io');
  socket.on("setup",(userData)=>{
    socket.join(userData?.id);    
    socket.emit("connected");
  })
  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log('user joined room '+ room);
  })

  

  socket.on("new message",(newMessageReceived)=>{
    var chat=newMessageReceived.chat;
    console.log("soooooooooooooockkkk");
    if(!chat.users) return console.log('chat.users not defined');

    chat.users.forEach((user)=>{
      if(user._id === newMessageReceived.sender._id) return;
      console.log("------",user);
      socket.in(user._id).emit("message received",newMessageReceived);
    })
  })

  socket.off("setup",()=>{
    console.log("User Disconnected");
    socket.leave(userData.id);
  })
})
