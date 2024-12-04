import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {BarChart} from 'react-native-chart-kit';

const API_URL = 'http://192.168.1.36:8000/api/proyectos/';

const GraphicScreen = ({route}: any) => {
  const {codigo_unico_inversion} = route.params;
  const [graphData, setGraphData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true); // Nueva variable de estado de carga

  useEffect(() => {
    fetchGraphData();
  }, [codigo_unico_inversion]);

  const fetchGraphData = () => {
    setLoading(true); // Iniciar carga
    axios
      .get(`${API_URL}${codigo_unico_inversion}`)
      .then(response => {
        processGraphData(response.data);
        setLoading(false); // Finalizar carga
      })
      .catch(error => {
        console.error('Error al obtener los datos del gráfico:', error);
        setLoading(false); // Finalizar carga en caso de error
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
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.graphContainer}>
          <Text style={styles.graphTitle}>Datos Procesados</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator
                size="large"
                color="#0000ff"
                style={styles.spinner}
              />
              <Text style={styles.loadingText}>Cargando datos...</Text>
            </View>
          ) : graphData.length > 0 ? (
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
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  graphContainer: {
    alignItems: 'center',
  },
  graphTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  spinner: {
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 16,
    color: 'black',
    marginTop: 10,
    fontWeight: '500',
  },
  chartStyle: {
    marginTop: 20,
    borderRadius: 8,
  },
  noDataText: {
    fontSize: 18,
    color: '#888',
    marginTop: 20,
    textAlign: 'center',
  },
});

export default GraphicScreen;
