
const { MongoClient, ServerApiVersion }  = require('mongodb');
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const url = process.env.MONGO_URI;

if (!url) {
  throw new Error("MONGO_URI is undefined. Check your .env file location.");
}

const client = new MongoClient(url, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}

run().catch(console.error);
