import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import axios from 'axios';
import {BarChart} from 'react-native-chart-kit';

const API_URL = 'http://192.168.1.36:8000/api/proyectos/';

const GraphicScreen = ({route}: any) => {
  const {codigo_unico_inversion} = route.params;
  const [graphData, setGraphData] = useState<any[]>([]);

  useEffect(() => {
    fetchGraphData();
  }, [codigo_unico_inversion]);

  const fetchGraphData = () => {
    axios
      .get(`${API_URL}${codigo_unico_inversion}`)
      .then(response => {
        processGraphData(response.data);
      })
      .catch(error => {
        console.error('Error al obtener los datos del gráfico:', error);
      });
  };

  const processGraphData = (data: any[]) => {
    const fieldCounts: {[key: string]: number} = {};

    const fieldsToCheck = [
      'nivel_gobierno',
      'situacion',
      'marco',
      'tipo_formato',
    ];

    data.forEach(item => {
      fieldsToCheck.forEach(field => {
        const value = item[field];
        if (value) {
          fieldCounts[value] = (fieldCounts[value] || 0) + 1;
        }
      });
    });

    const graphPreparedData = Object.entries(fieldCounts).map(
      ([label, count]) => ({
        label,
        count,
      }),
    );

    setGraphData(graphPreparedData);
  };

  const getGraphData = () => {
    const labels = graphData.map(item => item.label);
    const data = graphData.map(item => item.count);
    return {labels, datasets: [{data}]};
  };

  const screenWidth = Dimensions.get('window').width;

  // Configuración del gráfico
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    barPercentage: 1.0,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Datos Procesados</Text>

          {graphData.length > 0 ? (
            <BarChart
              data={getGraphData()}
              width={screenWidth - 40}
              height={400}
              chartConfig={{
                ...chartConfig,
                propsForBackgroundLines: {
                  fromZero: true,
                },
              }}
              fromZero={true}
              yAxisInterval={1}
              yAxisLabel=""
              yAxisSuffix=""
              verticalLabelRotation={90}
              showValuesOnTopOfBars={true}
              style={styles.chartStyle}
            />
          ) : (
            <Text style={styles.noDataText}>
              No hay datos disponibles para mostrar
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  graphContainer: {
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  graphTitle: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chartStyle: {
    borderRadius: 16,
  },
  noDataText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});

export default GraphicScreen;
