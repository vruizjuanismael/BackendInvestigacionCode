import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import {Project} from '../types';

const API_URL = 'http://192.168.1.36:8000/api/proyectos/';

const HomeScreen = ({navigation}: any) => {
  const [search, setSearch] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch inicial para obtener todos los proyectos
  useEffect(() => {
    axios
      .get(API_URL)
      .then(response => {
        setProjects(response.data);
        setFilteredProjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        setError('Error al obtener los proyectos');
        setLoading(false);
      });
  }, []);

  // Filtrar proyectos por campos relevantes
  const handleSearch = useCallback(
    (text: string) => {
      setSearch(text);

      // Normalizamos el texto de búsqueda y los datos antes de compararlos
      const normalizedText = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

      const filtered = projects.filter(
        project =>
          project.nombre_inversion
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalizedText.toLowerCase()) ||
          project.funcion
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalizedText.toLowerCase()) ||
          project.ejecutora
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalizedText.toLowerCase()) ||
          project.departamento
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalizedText.toLowerCase()) ||
          project.provincia
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(normalizedText.toLowerCase()),
      );
      setFilteredProjects(filtered);
    },
    [projects],
  );

  const replaceWithTilde = (text: string) => {
    // Reemplazar palabras como "FERREAFE" por "FERREÑAFE", "CAARI" por "CAÑARIS"
    const replacements: {[key: string]: string} = {
      FERREAFE: 'FERREÑAFE',
      CAARIS: 'CAÑARIS',
      // Añadir más reemplazos si es necesario
    };

    // Reemplazar cada coincidencia en el texto
    return text.replace(
      /\b(FERREAFE|CAARIS)\b/g,
      match => replacements[match] || match,
    );
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
        <Text style={styles.textCardDetails}>
          Monto Viable: {item.monto_viable}
        </Text>
        <Text style={styles.textCardDetails}>Función: {item.funcion}</Text>
        <Text style={styles.textCardDetails}>Situación: {item.situacion}</Text>
        <Text style={styles.textCardDetails}>
          Estado Inversión: {item.estado_inversion}
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
      </Pressable>
    ),
    [navigation],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        APLICACION DE CONSULTAS PARA PROYECTOS DE INVERSION PÚBLICA
      </Text>
      <Text style={styles.seBuscarPor}>
        Se puede buscar por: Nombre de Inversión, Función, Ejecutora,
        Departamento y Provincia.
      </Text>

      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar . . . "
        value={search}
        onChangeText={handleSearch}
      />

      {/* Indicador de carga */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : filteredProjects.length === 0 ? (
        <Text style={styles.noResultsText}>
          No se encontraron proyectos con ese criterio de búsqueda.
        </Text>
      ) : (
        <FlatList
          data={filteredProjects}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProjectItem}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
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
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 20,
    color: 'black',
    marginBottom: 16,
    textAlign: 'center',
  },
  seBuscarPor: {
    fontSize: 16,
    color: 'black',
    marginBottom: 16,
    textAlign: 'left',
  },
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  card: {
    borderWidth: 0.5,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 8,
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
