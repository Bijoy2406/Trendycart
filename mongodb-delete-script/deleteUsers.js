const { MongoClient } = require('mongodb');

async function deleteOtherUsers() {
  const uri = "mongodb+srv://labibfarhan285:CR7@cluster0.m7lnrxb.mongodb.net/TRANDYCART";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    console.log("Connecting to the database...");
    await client.connect();
    console.log("Connected successfully to the database");

    const database = client.db("TRANDYCART");
    const collection = database.collection("users");

    // Define the query to find the document you want to keep
    const query = { email: "admin@gmail.com" };

    console.log("Finding the document to keep...");
    // Find the document you want to keep
    const documentToKeep = await collection.findOne(query);

    if (documentToKeep) {
      console.log("Document found, proceeding to delete others...");
      // Delete all documents except the one to keep
      const result = await collection.deleteMany({ email: { $ne: "admin@gmail.com" } });
      console.log(`${result.deletedCount} documents were deleted`);
    } else {
      console.log("No document found with the email 'admin@gmail.com'");
    }
  } catch (err) {
    console.error("An error occurred:", err);
  } finally {
    await client.close();
    console.log("Connection closed");
  }
}

deleteOtherUsers().catch(console.dir);
