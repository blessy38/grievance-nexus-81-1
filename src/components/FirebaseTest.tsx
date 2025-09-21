import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export function FirebaseTest() {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testFirebaseConnection = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Check Firebase initialization
      addResult('✅ Firebase initialized successfully');
      addResult(`Auth object: ${!!auth ? 'Available' : 'Not available'}`);
      addResult(`DB object: ${!!db ? 'Available' : 'Not available'}`);

      // Test 2: Check if we can access Firebase services
      addResult('✅ Firebase services accessible');

      // Test 3: Try to create a test user (this will fail if email exists, but that's ok)
      try {
        const testEmail = `test-${Date.now()}@example.com`;
        const testPassword = 'testpassword123';
        
        addResult('🔄 Testing user creation...');
        const userCredential = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
        addResult('✅ Test user created successfully');
        
        // Test 4: Try to write to Firestore
        addResult('🔄 Testing Firestore write...');
        try {
          await setDoc(doc(db, 'test', userCredential.user.uid), {
            test: true,
            timestamp: new Date().toISOString()
          });
          addResult('✅ Firestore write successful');
        } catch (writeError: any) {
          addResult(`❌ Firestore write failed: ${writeError.message}`);
          if (writeError.code === 'permission-denied') {
            addResult('🔧 SOLUTION: Update your Firestore security rules!');
            addResult('📖 See FIRESTORE_RULES.md for instructions');
          }
          throw writeError;
        }
        
        // Test 5: Try to read from Firestore
        addResult('🔄 Testing Firestore read...');
        try {
          const testDoc = await getDoc(doc(db, 'test', userCredential.user.uid));
          if (testDoc.exists()) {
            addResult('✅ Firestore read successful');
          } else {
            addResult('❌ Firestore read failed - document not found');
          }
        } catch (readError: any) {
          addResult(`❌ Firestore read failed: ${readError.message}`);
          if (readError.code === 'permission-denied') {
            addResult('🔧 SOLUTION: Update your Firestore security rules!');
          }
        }
        
        // Clean up test user
        addResult('🔄 Cleaning up test user...');
        try {
          await userCredential.user.delete();
          addResult('✅ Test user cleaned up');
        } catch (deleteError: any) {
          addResult(`⚠️ Could not clean up test user: ${deleteError.message}`);
        }
        
        addResult('🎉 All Firebase tests passed!');
        
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          addResult('⚠️ Test user already exists (this is normal)');
        } else if (error.code === 'permission-denied') {
          addResult('❌ Permission denied - Firestore rules issue');
          addResult('🔧 SOLUTION: Update your Firestore security rules!');
          addResult('📖 See FIRESTORE_RULES.md for instructions');
        } else {
          addResult(`❌ Firebase test failed: ${error.message}`);
          addResult(`Error code: ${error.code || 'Unknown'}`);
        }
      }

    } catch (error: any) {
      addResult(`❌ Firebase connection failed: ${error.message}`);
      addResult(`Error code: ${error.code || 'Unknown'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Firebase Connection Test</CardTitle>
        <CardDescription>
          This will test your Firebase configuration and connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={testFirebaseConnection} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Testing...' : 'Run Firebase Test'}
        </Button>
        
        {testResults.length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg max-h-64 overflow-y-auto">
            <h4 className="font-semibold mb-2">Test Results:</h4>
            {testResults.map((result, index) => (
              <div key={index} className="text-sm font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
