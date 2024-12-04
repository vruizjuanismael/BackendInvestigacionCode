import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import {Project} from '../types';

const API_URL = 'http://192.168.1.36:8000/api/proyectos/';

const HomeScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial para obtener todos los proyectos
  useEffect(() => {
    axios
      .get(API_URL)
      .then(response => {
        setProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error al obtener los proyectos');
        setLoading(false);
      });
  }, []);

  // Filtrar proyectos por campos relevantes
  const handleSearch = useCallback((text: string) => {
    setSearch(text);
  }, []);

  // Validar si la búsqueda está vacía o contiene solo espacios
  const isSearchValid = search.trim().length > 0;

  // Memoizamos el resultado de la búsqueda
  const filteredProjects = useMemo(() => {
    if (!isSearchValid) {
      return projects; // Si la búsqueda no es válida, mostramos todos los proyectos
    }

    const normalizedText = search
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ''); // Normalizamos la búsqueda

    return projects.filter(project => {
      const searchIn = [
        project.nombre_inversion,
        project.funcion,
        project.ejecutora,
        project.departamento,
        project.provincia,
        project.estado_inversion,
      ];

      return searchIn.some(field =>
        field
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase()
          .includes(normalizedText.toLowerCase()),
      );
    });
  }, [search, projects]);

  const replaceWithTilde = (text: string) => {
    const replacements: {[key: string]: string} = {
      FERREAFE: 'FERREÑAFE',
      CAARIS: 'CAÑARIS',
      //Agregar otros
    };
    return text.replace(
      /\b(FERREAFE|CAARIS)\b/g,
      match => replacements[match] || match,
    );
  };

  const formatSoles = (amount: any) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const renderProjectItem = useCallback(
    ({item}: {item: Project}) => (
      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate('Details', {
            codigo_unico_inversion: item.codigo_unico_inversion,
          })
        }>
        <Text style={styles.cardTitle}>{item.nombre_inversion}</Text>
        <View style={styles.cardViewDividerContainer}>
          <View style={styles.cardViewDividerLeft}>
            <Text style={styles.textCardDetails}>
              Monto Viable: {formatSoles (item.monto_viable)}
            </Text>
            <Text style={styles.textCardDetails}>Función: {item.funcion}</Text>
            <Text style={styles.textCardDetails}>
              Situación: {item.situacion}
            </Text>
            <Text style={styles.textCardDetails}>
              Estado de inversión: {item.estado_inversion}
            </Text>
            <Text style={styles.textCardDetails}>
              Ejecutora: {replaceWithTilde(item.ejecutora)}
            </Text>
            <Text style={styles.textCardDetails}>
              Beneficiarios: {item.beneficiarios}
            </Text>
            <Text style={styles.textCardDetails}>
              Departamento: {replaceWithTilde(item.departamento)}
            </Text>
            <Text style={styles.textCardDetails}>
              Provincia: {replaceWithTilde(item.provincia)}
            </Text>
          </View>
        </View>
      </Pressable>
    ),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        APLICACIÓN DE CONSULTAS DE PROYECTOS DE INVERSIÓN PÚBLICA
      </Text>
      <Text style={styles.seBuscarPor}>
        Se puede buscar por: nombre de inversión, función, ejecutora,
        departamento y provincia.
      </Text>
      {/* Barra de búsqueda */}
      <View style={styles.searchInputContainer}>
        <Image
          source={require('../assets/images/search.png')}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar . . . "
          value={search}
          onChangeText={handleSearch}
        />
      </View>
      <Text style={styles.seleccionar}>Seleccione un proyecto:</Text>
      {/* Indicador de carga */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredProjects.length === 0 && isSearchValid ? (
        <Text style={styles.noResultsText}>
          No se encontraron proyectos con ese criterio de búsqueda.
        </Text>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProjectItem}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: '#FAFAFA',
  },
  header: {
    fontSize: 20,
    color: 'black',
    fontStyle: 'italic',
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  seBuscarPor: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    textAlign: 'left',
  },
  seleccionar: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
    paddingTop: 4,
    textAlign: 'left',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    marginVertical: 1,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  searchIcon: {
    height: 24,
    width: 24,
    marginRight: 10,
  },
  searchBar: {
    width: '89%',
    borderRadius: 8,
    fontStyle: 'italic',
    color: 'black',
    fontWeight: 'bold',
    padding: 6,
  },
  card: {
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 8,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    color: 'black',
    marginBottom: 8,
  },
  cardViewDividerContainer: {
    flexDirection: 'row',
  },
  cardViewDividerLeft: {
    width: '100%',
  },
  cardViewDividerRight: {
    width: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textCardDetails: {
    fontSize: 14,
    color: 'black',
    paddingBottom: 1,
  },
  errorText: {
    fontSize: 14,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noResultsText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default HomeScreen;
