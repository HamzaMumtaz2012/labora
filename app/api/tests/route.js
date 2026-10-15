import getMongoClient from '../../../lib/mongodb.js';

export async function GET() {
  try {
    const client = await getMongoClient();
    const records = await client
      .db('Labora')
      .collection('Tests')
      .find(
        {},
        { projection: { _id: 0, testName: 1, testCode: 1, doctorName: 1 } }
      )
      .sort({ testName: 1 })
      .toArray();

    const tests = records
      .filter((test) => typeof test.testName === 'string' && test.testName.trim())
      .map((test) => ({
        testName: test.testName,
        testCode: typeof test.testCode === 'string' ? test.testCode : '',
        doctorName: typeof test.doctorName === 'string' ? test.doctorName : '',
      }));

    return Response.json({ tests });
  } catch (error) {
    console.error('Failed to load tests:', error);
    const isConfigurationError =
      error instanceof Error && error.message.startsWith('Missing MONGODB_URI');

    return Response.json(
      {
        error: isConfigurationError
          ? 'The test database is not configured on the server.'
          : 'Could not load tests. Check the server’s MongoDB connection and try again.',
      },
      { status: isConfigurationError ? 503 : 500 }
    );
  }
}
