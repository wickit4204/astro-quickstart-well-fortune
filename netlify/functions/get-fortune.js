const { Client } = require('pg');

exports.handler = async (event, context) => {
  // Uses the DATABASE_URL you saved in Netlify's Environment Variables
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    
    // Grabs one random fortune from the list we just seeded
    const result = await client.query('SELECT content FROM fortunes ORDER BY RANDOM() LIMIT 1');
    const fortune = result.rows[0].content;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: fortune }),
    };
  } catch (err) {
    console.error(err);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ text: "The well is murky. Try again when the silt settles." }) 
    };
  } finally {
    await client.end();
  }
};
