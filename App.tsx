import React, {useEffect, useState} from 'react';
import {
  useColorScheme,
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
} from 'react-native';
import {Input, Button, ListItem} from 'react-native-elements';
import {pedDB} from './db/pen-db';
import PenDetails, {SyncStatus} from './models/PenDetails';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [penDetails, setPenDetails] = useState<PenDetails[]>([]);
  useEffect(() => {
    // Initialize the database
    pedDB
      .fetchAllPenDetails()
      .then(penDetails => {
        setPenDetails(penDetails);
      })
      .catch(error => {
        console.error('Error initializing database or fetching data:', error);
      });
  }, []);

  const fetchPenDetails = async () => {
    setTimeout(async () => {
      try {
        setPenDetails(await pedDB.fetchAllPenDetails());
        console.log('Pen details:', penDetails);
      } catch (error) {
        console.log('Error fetching pen details:', error);
      }
    }, 3000);
  };

  const addPenDetails = async (penDetails: PenDetails) => {
    try {
      await pedDB.addPenDetails(penDetails);
      fetchPenDetails();
    } catch (error) {
      console.log('Error adding pen details:', error);
    }
  };

  const syncPenDetails = async (penDetails: PenDetails) => {
    try {
      await pedDB.addPenDetails(penDetails);
      fetchPenDetails();
    } catch (error) {
      console.log('Error adding pen details:', error);
    }
  };

  return (
    <SafeAreaView>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: 15,
          }}>
          <Input label="Head Count" placeholder="enter head count" />
          <Input label="Bunk Score" placeholder="enter bunk score" />
          <Button
            onPress={() => {
              addPenDetails({
                headCount: 100,
                date: new Date(),
                bunkScore: 10,
                syncStatus: SyncStatus.NotSynced,
              });
            }}
            title="Add"
          />
          <Button
            onPress={() => {
              addPenDetails({
                headCount: 100,
                date: new Date(),
                bunkScore: 10,
                syncStatus: SyncStatus.NotSynced,
              });
            }}
            title="Sync"
          />
        </View>
        <View>
          {penDetails &&
            penDetails.map(item => (
              <ListItem
                children={
                  <View>
                    <Text>{item.headCount}</Text>
                    <Text>{item.bunkScore}</Text>
                    <Text>{item.date.toDateString()}</Text>
                  </View>
                }
              />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default App;
