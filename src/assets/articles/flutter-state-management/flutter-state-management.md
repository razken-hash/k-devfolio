# State Management dans Flutter

La gestion d'état est cruciale dans Flutter. Comparons les principales solutions disponibles.

## BLoC Pattern

Business Logic Component sépare la logique de l'UI:

```dart
class CounterBloc extends Bloc<CounterEvent, int> {
  CounterBloc() : super(0) {
    on<IncrementEvent>((event, emit) => emit(state + 1));
    on<DecrementEvent>((event, emit) => emit(state - 1));
  }
}

// Usage
BlocProvider(
  create: (context) => CounterBloc(),
  child: CounterView(),
)
```

## Provider

Simple et efficace:

```dart
class Counter extends ChangeNotifier {
  int _count = 0;
  int get count => _count;

  void increment() {
    _count++;
    notifyListeners();
  }
}

// Usage
ChangeNotifierProvider(
  create: (_) => Counter(),
  child: MyApp(),
)
```

## Riverpod

L'évolution de Provider:

```dart
final counterProvider = StateProvider<int>((ref) => 0);

class CounterWidget extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final count = ref.watch(counterProvider);
    return Text('$count');
  }
}
```

## Conclusion

Chaque solution a ses avantages. Choisissez en fonction de:
- Complexité du projet
- Expérience de l'équipe
- Besoins en testabilité