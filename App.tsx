import React, {useEffect, useState} from 'react';
import {
  useColorScheme,
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {Input, Button, ListItem, Card} from 'react-native-elements';
import {pedDB} from './db/pen-db';
import PenDetails, {SyncStatus} from './models/PenDetails';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [penDetails, setPenDetails] = useState<PenDetails[]>([]);
  const [headCount, setHeadCount] = useState<number>(0);
  const [bunkScore, setBunkScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
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
        fetchPenDetails();
        console.log('Error fetching pen details:', error);
      }
    }, 1000);
  };

  const addPenDetails = async (penDetails: PenDetails) => {
    try {
      pedDB.addPenDetails(penDetails);
      fetchPenDetails();
    } catch (error) {
      console.log('Error adding pen details:', error);
    }
  };

  const syncPenDetails = async () => {
    setLoading(true);
    setTimeout(() => {
      try {
        pedDB.updateSyncStatus();
        fetchPenDetails();
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log('Error adding pen details:', error);
      }
    }, 2000);
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
          <Input
            label="Head Count"
            placeholder="enter head count"
            keyboardType="numeric"
            onChangeText={text => {
              setHeadCount(parseInt(text));
            }}
          />
          <Input
            label="Bunk Score"
            placeholder="enter bunk score"
            keyboardType="numeric"
            onChangeText={text => {
              setBunkScore(parseInt(text));
            }}
          />
          <Button
            onPress={() => {
              if (!headCount || !bunkScore) return;
              addPenDetails({
                headCount: headCount,
                date: new Date(),
                bunkScore: bunkScore,
                syncStatus: SyncStatus.NotSynced,
              });
            }}
            title="Add"
          />
          <View style={{padding: 5}}></View>
          <Button
            onPress={() => {
              syncPenDetails();
            }}
            title="Sync"
            loading={loading}
          />
        </View>
        <View>
          {penDetails?.map(item => (
            <ListItem key={item.penId}>
              <View style={ItemStyle.itemView}>
                <Text>{`Head Count: ${item.headCount}`}</Text>
                <Text>{`Bunk Score: ${item.bunkScore}`}</Text>
                <Text>{`At: ${item.date.toDateString()}`}</Text>
                <Text>{`Status: ${item.syncStatus}`}</Text>
              </View>
            </ListItem>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
const ItemStyle = StyleSheet.create({
  itemView: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 4,
    elevation: 2,
    borderRadius: 4,
    backgroundColor: 'white',
  },
});

export default App;
